"use client";

import { auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import cats from "../../../lib/cats";
import user from "../../../lib/user";
import { GeoPoint } from 'firebase/firestore';

import {
  getAllCats,
  getCat,
  createOrUpdateCat,
  deleteCat,
} from '@/lib/cats'; 

interface Cat {
  id: string,
  about: string,
  coordinates: GeoPoint,
  dietary_restrictions: string[],
  fav_spot: string,
  feeding_time: string[],
  image_url: string,
  recommended_snacks: string[],
  tagline: string,
  where_not_to_rub: string[],
  where_to_rub: string[]
};

// --- Sample Data for Testing ---
const TEST_CAT_ID = 'test-cat-id-123';
const SAMPLE_CAT: Cat = {
  id: TEST_CAT_ID,
  about: 'The friendly test cat.',
  coordinates: new GeoPoint(40.7128, -74.0060), 
  dietary_restrictions: ['None'],
  fav_spot: 'Under the monitor',
  feeding_time: ['7:00 AM', '5:00 PM'],
  image_url: 'http://example.com/test_cat.jpg',
  recommended_snacks: ['Tuna flakes'],
  tagline: 'Here to test your code.',
  where_not_to_rub: ['Tummy'],
  where_to_rub: ['Ears'],
};

export default function AdminTestPage() {
  const [results, setResults] = useState<string>('Click a button to run a test.');
  const [catIdInput, setCatIdInput] = useState<string>('catIdForGetTest'); 

  const runTest = async (func: () => Promise<any>, testName: string) => {
    setResults(`Running ${testName}...`);
    try {
      const result = await func();
      setResults(`✅ ${testName} Succeeded! Result: \n${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setResults(`❌ ${testName} Failed! Error: \n${error instanceof Error ? error.message : String(error)}`);
      console.error(error);
    }
  };

  const baseButtonClasses = "px-4 py-2 text-white font-semibold rounded-md shadow-md transition-colors duration-200 hover:shadow-lg";
  const primaryButtonClasses = `${baseButtonClasses} bg-blue-600 hover:bg-blue-700`;
  const dangerButtonClasses = `${baseButtonClasses} bg-red-600 hover:bg-red-700`;


  return (
    <div className="p-8 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Firebase Cat Functions Test Page 🧪</h1>
      <p className="mb-6 text-gray-600">This page uses the ID: <strong className="text-blue-600">{TEST_CAT_ID}</strong> for create/update/delete operations.</p>
      
      {/* Test Buttons Container */}
      <div className="flex flex-wrap gap-4 mb-6">
        
        <button 
          onClick={() => runTest(getAllCats, 'getAllCats')} 
          className={primaryButtonClasses}
        >
          Test getAllCats
        </button>

        <button 
          onClick={() => runTest(() => getCat(catIdInput), 'getCat')} 
          className={primaryButtonClasses}
        >
          Test getCat ({catIdInput})
        </button>

        <button 
          onClick={() => runTest(() => createOrUpdateCat(SAMPLE_CAT), 'createOrUpdateCat')} 
          className={primaryButtonClasses}
        >
          Test createOrUpdateCat (ID: {TEST_CAT_ID})
        </button>
        
        <button 
          onClick={() => runTest(() => deleteCat(TEST_CAT_ID), 'deleteCat')} 
          className={dangerButtonClasses}
        >
          Test deleteCat (ID: {TEST_CAT_ID})
        </button>
      </div>

      {/* Input for getCat test */}
      <div className="mb-6 flex items-center">
        <label htmlFor="catIdInput" className="text-gray-700 font-medium mr-2">Cat ID for **getCat** test: </label>
        <input
          id="catIdInput"
          type="text"
          value={catIdInput}
          onChange={(e) => setCatIdInput(e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>


      <h2 className="text-2xl font-semibold mb-3 text-gray-800">Results Console:</h2>
      {/* Results Display */}
      <pre 
        className="bg-gray-800 text-white p-4 border border-gray-700 rounded-lg shadow-inner overflow-x-auto whitespace-pre-wrap text-sm"
      >
        {results}
      </pre>
    </div>
  );
};
