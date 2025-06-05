import { ChromaClient } from 'chromadb';
import dotenv from 'dotenv';

dotenv.config();

const CHROMA_DB_HOST = process.env.CHROMA_DB_HOST || 'localhost';
const CHROMA_DB_PORT = process.env.CHROMA_DB_PORT || '8000';
const CHROMA_DB_URL = `http://${CHROMA_DB_HOST}:${CHROMA_DB_PORT}`;

const client = new ChromaClient();

export const getOrCreateCollection = async (collectionName: string) => {
  try {
    const collection = await client.getCollection({ name: collectionName });
    console.log(`Using existing ChromaDB collection: ${collectionName}`);
    return collection;
  } catch (error) {
    console.log(`Creating new ChromaDB collection: ${collectionName}`);
    const collection = await client.createCollection({ name: collectionName });
    return collection;
  }
};

export default client; 