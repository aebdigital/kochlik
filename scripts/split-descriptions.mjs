

const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5naWZlbmdlc2h3dnl6aHF2cHJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDkyOTQ3NywiZXhwIjoyMDgwNTA1NDc3fQ.Z9WYgeJ8EDZzPhCRDSvq1-lo-v0DHc2rAfr22WMyB60';
const SUPABASE_URL = 'https://ngifengeshwvyzhqvprn.supabase.co';
const OWNER_ID = 'c28707c3-2289-48b9-bbd3-08a441fd02fc';

async function run() {
  console.log('Fetching products from Supabase...');
  const fetchUrl = `${SUPABASE_URL}/rest/v1/kochlik_products?select=id,name,slug,description,short_description&owner_id=eq.${OWNER_ID}`;
  const response = await fetch(fetchUrl, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch products:', response.status, await response.text());
    process.exit(1);
  }

  const products = await response.json();
  console.log(`Fetched ${products.length} products total.`);

  let updatedCount = 0;

  for (const product of products) {
    const desc = product.description || '';
    const supplierIndex = desc.toLowerCase().indexOf('pre viac inform');

    if (supplierIndex === -1) {
      continue;
    }

    // Split the text
    const newDescription = desc.substring(0, supplierIndex).trim();
    const newShortDescription = desc.substring(supplierIndex).trim();

    console.log(`Updating product: "${product.name}" (${product.slug})`);
    console.log(`  -> Description (len: ${desc.length} -> ${newDescription.length})`);
    console.log(`  -> Short Description (len: ${newShortDescription.length})`);

    const updateUrl = `${SUPABASE_URL}/rest/v1/kochlik_products?id=eq.${product.id}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        description: newDescription,
        short_description: newShortDescription,
      }),
    });

    if (!updateResponse.ok) {
      console.error(`  [!] Failed to update "${product.name}":`, updateResponse.status, await updateResponse.text());
    } else {
      updatedCount++;
    }
  }

  console.log(`\nFinished migration. Successfully updated ${updatedCount} products.`);
}

run();
