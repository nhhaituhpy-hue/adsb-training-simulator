CREATE TABLE IF NOT EXISTS Scenarios (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  sites_json TEXT NOT NULL,
  target_sensor_id TEXT NOT NULL,
  target_login_user TEXT NOT NULL,
  expected_actions_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT
);
