import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {

  const createDbIfNeeded = async (db: SQLiteDatabase) => {
    console.log("Creating database if needed...");
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
    INSERT INTO test (value, intValue) VALUES ('test1', 123);
    INSERT INTO test (value, intValue) VALUES ('test2', 456);
    INSERT INTO test (value, intValue) VALUES ('test3', 789);
    `);
  }

  return(
    <SQLiteProvider databaseName="stopwatch.db" onInit={createDbIfNeeded}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="stopwatchScreen" />
      </Stack>
    </SQLiteProvider>
  );
}
