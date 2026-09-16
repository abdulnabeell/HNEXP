const API = "http://localhost:5000/api";

let TOKEN_A = "";
let TOKEN_B = "";

const uniqueId = Date.now();
const EMAIL_A = `usera_${uniqueId}@example.com`;
const EMAIL_B = `userb_${uniqueId}@example.com`;

async function req(endpoint, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json"
  };
  if (token !== false) {
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers: token !== false ? headers : undefined, // omit completely if false
    body: body ? JSON.stringify(body) : null
  });
  
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  
  return { status: res.status, data };
}

async function runTests() {
  console.log("=========================================");
  console.log("TESTING NEW ENDPOINTS");
  console.log("=========================================\n");

  let fails = 0;
  const assert = (condition, msg) => {
    if (!condition) {
      console.error(`❌ FAIL: ${msg}`);
      fails++;
    } else {
      console.log(`✅ PASS: ${msg}`);
    }
  };

  // Setup Users
  await req("/auth/register", "POST", { name: "Test User A", email: EMAIL_A, password: "password123" });
  let res = await req("/auth/login", "POST", { email: EMAIL_A, password: "password123" });
  TOKEN_A = res.data.token;

  await req("/auth/register", "POST", { name: "Test User B", email: EMAIL_B, password: "password123" });
  res = await req("/auth/login", "POST", { email: EMAIL_B, password: "password123" });
  TOKEN_B = res.data.token;

  // Add some data for User A
  await req("/expenses", "POST", { title: "Uber ride", amount: 20, category: "Transport" }, TOKEN_A);
  await req("/expenses", "POST", { title: "Lunch with client", amount: 45, category: "Food" }, TOKEN_A);
  await req("/expenses", "POST", { title: "Office supplies", amount: 150, category: "Shopping", description: "notebooks and pens" }, TOKEN_A);

  // Add data for User B
  await req("/expenses", "POST", { title: "Uber eats lunch", amount: 30, category: "Food" }, TOKEN_B);

  console.log("\n--- GET /api/auth/me ---");
  res = await req("/auth/me", "GET", null, TOKEN_A);
  assert(res.status === 200, "Valid JWT returns 200");
  assert(res.data.name === "Test User A", "Returns correct user profile");
  assert(res.data.password === undefined, "Does NOT return password");

  res = await req("/auth/me", "GET", null, false);
  assert(res.status === 401, "Missing JWT returns 401");

  res = await req("/auth/me", "GET", null, "invalid-jwt");
  assert(res.status === 401, "Invalid JWT returns 401");

  console.log("\n--- GET /api/expenses?search=lunch ---");
  res = await req("/expenses?search=lunch", "GET", null, TOKEN_A);
  assert(res.status === 200, "Search query returns 200");
  assert(res.data.length === 1 && res.data[0].title.includes("Lunch"), "Returns exact search match for User A");
  
  res = await req("/expenses?search=lunch", "GET", null, TOKEN_B);
  assert(res.data.length === 1 && res.data[0].title.includes("lunch"), "Data isolation: User B only sees their lunch");

  console.log("\n--- GET /api/expenses?category=Food ---");
  res = await req("/expenses?category=Food", "GET", null, TOKEN_A);
  assert(res.status === 200, "Category filter returns 200");
  assert(res.data.length === 1, "Returns only Food category for User A");

  console.log("\n--- GET /api/expenses?search=lunch&category=Food ---");
  res = await req("/expenses?search=uber&category=Transport", "GET", null, TOKEN_A);
  assert(res.status === 200, "Combined filter returns 200");
  assert(res.data.length === 1 && res.data[0].title.includes("Uber"), "Applies both search and category filters correctly");

  console.log("\n--- GET /api/expenses/summary ---");
  res = await req("/expenses/summary", "GET", null, TOKEN_A);
  assert(res.status === 200, "Summary endpoint returns 200");
  assert(res.data.totalExpenses === 3, "Total expenses calculated correctly");
  assert(res.data.totalSpending === 215, "Total spending calculated correctly");
  assert(res.data.topCategory.name === "Shopping" && res.data.topCategory.amount === 150, "Top category calculated correctly");

  res = await req("/expenses/summary", "GET", null, TOKEN_B);
  assert(res.data.totalSpending === 30, "Data isolation: User B summary only reflects their expenses");

  console.log("\n--- GET /api/expenses/summary/chart?period=week ---");
  res = await req("/expenses/summary/chart?period=week", "GET", null, TOKEN_A);
  assert(res.status === 200, "Chart endpoint returns 200");
  assert(res.data.period === "week", "Returns correct period");
  assert(Array.isArray(res.data.data), "Returns data array");

  res = await req("/expenses/summary/chart?period=month", "GET", null, TOKEN_A);
  assert(res.status === 200, "Month period returns 200");

  res = await req("/expenses/summary/chart?period=year", "GET", null, TOKEN_A);
  assert(res.status === 200, "Year period returns 200");
  
  res = await req("/expenses/summary/chart?period=invalid", "GET", null, TOKEN_A);
  assert(res.status === 400, "Invalid period returns 400");

  res = await req("/expenses/summary/chart", "GET", null, false);
  assert(res.status === 401, "Missing JWT on chart returns 401");

  console.log("\n=========================================");
  console.log(`TOTAL FAILS: ${fails}`);
  console.log("=========================================\n");
}

runTests();
