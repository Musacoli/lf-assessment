import {Pinecone, PineconeRecord} from "@pinecone-database/pinecone";
import OpenAI from 'openai'

const pinecone = new Pinecone()

const openai = new OpenAI()

const indexName = process.env.PINECONE_INDEX_NAME || ''

if (indexName === '') {
  throw new Error('PINECONE_INDEX_NAME environment variable is not set');
}

// Create embeddings to be used for querying
export const createEmbeddings = async (batch: string[]): Promise<number[][]> => {
  let passed = false;
  let res: OpenAI.CreateEmbeddingResponse | undefined;
  const embedModel = 'text-embedding-ada-002';

  for (let j = 0; j < 5; j++) {
    try {
      res = await openai.embeddings.create({
        model: embedModel,
        input: batch
      });

      passed = true;
      break;
    } catch (error) {
      console.log("Error creating embeddings:", error);
      if (error instanceof OpenAI.RateLimitError) {
        await new Promise(resolve => setTimeout(resolve, 2 ** j * 1000));
        console.log("Retrying...");
      } else {
        console.error('Unexpected error occurred:', error);
        break;
      }
    }
  }

  if (!passed) {
    throw new Error("Failed to create embeddings after maximum retries.");
  }

  if (res === undefined) {
    throw new Error("Failed to create embeddings, response is undefined.")
  }

  return res.data.map(record => record.embedding);
};


export const getMatchingContractVectors = async (query: string, topK: number = 3, namespace: string): Promise<PineconeRecord[]>  => {
  const index = pinecone.index(indexName)

  const pineconeNamespace = index.namespace(namespace ?? '')

  const encodedQuery = await createEmbeddings([query])


  const results = await pineconeNamespace.query({
    topK,
    vector: encodedQuery[0],
    includeMetadata: true,
  })

  return results.matches
}

export const getContextString = (vectors: PineconeRecord[]) => {
  const context: string[] = []

  vectors.forEach((match: PineconeRecord) => {
    if (match.metadata) context.push(match.metadata.text as string)
  })

  return context.join(" ")
}
