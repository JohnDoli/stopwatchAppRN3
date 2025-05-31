import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";

export default function RootLayout() {

  const createDbIfNeeded = async (db: SQLiteDatabase) => {
    console.log("Creating database if needed...");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS stopwatch (id INTEGER PRIMARY KEY NOT NULL, itemName TEXT NOT NULL, timeMs INTEGER);
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
