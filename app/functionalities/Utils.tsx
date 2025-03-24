// Wrap the function with cache so that repeated calls return the cached result
"use server";
import { data_get } from '../properties/urls';




async function getData() {
    // Simulate fetching 80,000 points
    const response = await fetch(`${data_get}`);

    if (!response.ok) throw new Error('Failed to send files to backend');

    const points = await response.json();
    return points
  };


export default getData;