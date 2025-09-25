import { assertEquals } from "@std/assert";
import { assertSpyCalls, spy } from "@std/testing/mock";

// Define types for better code quality
interface User {
  name: string;
}

interface Database {
  save: (user: User) => Promise<User & { id: number }>;
}

// Function to test
function saveUser(
  user: User,
  database: Database,
): Promise<User & { id: number }> {
  return database.save(user);
}

// Test with a mock
Deno.test("saveUser calls database.save", async () => {
  // Create a mock database with a spy on the save method
  const mockDatabase = {
    save: spy((user: User) => Promise.resolve({ id: 1, ...user })),
  };

  const user: User = { name: "Test User" };
  const result = await saveUser(user, mockDatabase);

  // Verify the mock was called correctly
  assertSpyCalls(mockDatabase.save, 1);
  assertEquals(mockDatabase.save.calls[0].args[0], user);
  assertEquals(result, { id: 1, name: "Test User" });
});
