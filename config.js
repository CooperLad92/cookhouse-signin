// Fill these in from your Supabase project:
// Supabase dashboard -> Settings -> API
const SUPABASE_URL = "https://tfebbjaniwwpidloerns.supabase.co";       // e.g. https://xxxxxxxx.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZWJiamFuaXd3cGlkbG9lcm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1MjgyOTIsImV4cCI6MjEwNDEwNDI5Mn0.9vRLMNO6fc2Ghuuh07aT9nbWijIWgk1YVF1XsSMGPyE";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- Meal time windows (24hr, local device time) ----
// Edit these to change the sitting times.
const MEAL_WINDOWS = [
  { key: "breakfast", label: "Breakfast", start: "07:00", end: "09:30" },
  { key: "lunch",     label: "Lunch",     start: "12:30", end: "14:00" },
  { key: "dinner",    label: "Dinner",    start: "16:30", end: "18:00" },
];

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// Returns the active meal object, or null if outside all windows.
function getCurrentMeal(now = new Date()) {
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const w of MEAL_WINDOWS) {
    if (nowMins >= toMinutes(w.start) && nowMins < toMinutes(w.end)) {
      return w;
    }
  }
  return null;
}

// Returns a friendly message about the next meal window when scanning outside all windows.
function getClosedMessage(now = new Date()) {
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const upcoming = MEAL_WINDOWS.find(w => toMinutes(w.start) > nowMins);
  if (upcoming) {
    return `Sign-in is closed right now. ${upcoming.label} opens at ${upcoming.start}.`;
  }
  return "Sign-in is closed right now. Breakfast opens tomorrow at " + MEAL_WINDOWS[0].start + ".";
}

function todayDateString() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
