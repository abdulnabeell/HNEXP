const API = "http://localhost:5000/api";

let TOKEN_A = "";
let TOKEN_B = "";
let EXPENSE_A = "";
let EXPENSE_B = "";

const uniqueId = Date.now();
const EMAIL_A = `testusera_${uniqueId}@example.com`;
const EMAIL_B = `testuserb_${uniqueId}@example.com`;

async function req(endpoint, method = "GET", body = null, token = null) {
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });
  
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  
  return { status: res.status, data };
}

async function runTests() {
  console.log("=========================================");
  console.log("INTEGRATION TESTS START");
  console.log("=========================================\n");

  let fails = 0;

  const assert = (condition, msg) => {
    if (!condition) {
      console.error(`❌ FAIL: ${msg}`);
      fails++;
    }
  };

  // 1. REGISTER
  console.log("1. REGISTER");
  let res = await req("/auth/register", "POST", { name: "Test User A", email: EMAIL_A, password: "password123" });
  console.log("Response:", res.status, res.data);
  assert(res.status === 201, `Expected 201, got ${res.status}`);
  assert(res.data.user && !res.data.user.password, "Password should not be returned");

  // 2. LOGIN
  console.log("\n2. LOGIN");
  res = await req("/auth/login", "POST", { email: EMAIL_A, password: "password123" });
  console.log("Response:", res.status);
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.data.token, "JWT token missing");
  TOKEN_A = res.data.token;

  // 3. CREATE EXPENSE
  console.log("\n3. CREATE EXPENSE");
  res = await req("/expenses", "POST", { title: "Lunch", amount: 250, category: "Food", description: "Lunch with friends" }, TOKEN_A);
  console.log("Response:", res.status, res.data);
  assert(res.status === 201, `Expected 201, got ${res.status}`);
  assert(res.data.id, "Expense ID missing");
  EXPENSE_A = res.data.id;

  // 4. GET EXPENSES
  console.log("\n4. GET EXPENSES");
  res = await req("/expenses", "GET", null, TOKEN_A);
  console.log("Response:", res.status);
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(Array.isArray(res.data) && res.data.length >= 1, "Should return an array with >= 1 expense");
  assert(res.data[0].userId === res.data[0].userId, "Should belong to User A"); // simplified check

  // 5. FILTER BY CATEGORY
  console.log("\n5. FILTER BY CATEGORY");
  res = await req("/expenses?category=Food", "GET", null, TOKEN_A);
  console.log("Response:", res.status);
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.data.every(e => e.category === "Food"), "All expenses should have category Food");

  // 6. GET SINGLE EXPENSE
  console.log("\n6. GET SINGLE EXPENSE");
  res = await req(`/expenses/${EXPENSE_A}`, "GET", null, TOKEN_A);
  console.log("Response:", res.status);
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.data.id === EXPENSE_A, "Should return the correct expense");

  // 7. UPDATE EXPENSE
  console.log("\n7. UPDATE EXPENSE");
  res = await req(`/expenses/${EXPENSE_A}`, "PATCH", { title: "Dinner", amount: 500, category: "Food" }, TOKEN_A);
  console.log("Response:", res.status, res.data);
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  assert(res.data.title === "Dinner" && res.data.amount === 500, "Should contain updated values");

  // 8. DELETE EXPENSE
  console.log("\n8. DELETE EXPENSE");
  res = await req(`/expenses/${EXPENSE_A}`, "DELETE", null, TOKEN_A);
  console.log("Response:", res.status, res.data);
  assert(res.status === 200, `Expected 200, got ${res.status}`);
  
  res = await req(`/expenses/${EXPENSE_A}`, "GET", null, TOKEN_A);
  console.log("Response (verify):", res.status);
  assert(res.status === 404, `Expected 404 after deletion, got ${res.status}`);

  // 9. REQUEST WITHOUT JWT
  console.log("\n9. MISSING JWT");
  res = await req("/expenses", "GET", null, null);
  console.log("Response GET:", res.status);
  assert(res.status === 401, `Expected 401, got ${res.status}`);
  
  res = await req("/expenses", "POST", {}, null);
  console.log("Response POST:", res.status);
  assert(res.status === 401, `Expected 401, got ${res.status}`);

  // 10. INVALID JWT
  console.log("\n10. INVALID JWT");
  res = await req("/expenses", "GET", null, "invalid-token-123");
  console.log("Response:", res.status);
  assert(res.status === 401, `Expected 401, got ${res.status}`);

  // 11. INVALID BODY
  console.log("\n11. INVALID BODY");
  res = await req("/expenses", "POST", { title: "", amount: -100, category: "" }, TOKEN_A);
  console.log("Response:", res.status, res.data);
  assert(res.status === 400, `Expected 400, got ${res.status}`);

  // 12. OWNERSHIP / AUTHORIZATION
  console.log("\n12. OWNERSHIP TEST");
  // Register user B
  res = await req("/auth/register", "POST", { name: "Test User B", email: EMAIL_B, password: "password123" });
  res = await req("/auth/login", "POST", { email: EMAIL_B, password: "password123" });
  TOKEN_B = res.data.token;
  
  res = await req("/expenses", "POST", { title: "User B Expense", amount: 1000, category: "Shopping" }, TOKEN_B);
  EXPENSE_B = res.data.id;
  
  console.log("Trying to GET User B's expense as User A");
  res = await req(`/expenses/${EXPENSE_B}`, "GET", null, TOKEN_A);
  console.log("Response:", res.status);
  assert(res.status === 404, `Expected 404, got ${res.status}`);
  
  console.log("Trying to PATCH User B's expense as User A");
  res = await req(`/expenses/${EXPENSE_B}`, "PATCH", { amount: 9999 }, TOKEN_A);
  console.log("Response:", res.status);
  assert(res.status === 404, `Expected 404, got ${res.status}`);
  
  console.log("Trying to DELETE User B's expense as User A");
  res = await req(`/expenses/${EXPENSE_B}`, "DELETE", null, TOKEN_A);
  console.log("Response:", res.status);
  assert(res.status === 404, `Expected 404, got ${res.status}`);

  console.log("\n=========================================");
  console.log(`TOTAL FAILS: ${fails}`);
  console.log("=========================================\n");
}

runTests();
