import type { Scenario, SiteState, RecordedAction } from "./types";

// Định nghĩa giao diện tối giản cho D1Database để không phụ thuộc vào workers-types
export interface D1DatabaseSimple {
  prepare(query: string): {
    bind(...args: any[]): {
      first<T = any>(): Promise<T | null>;
      all<T = any>(): Promise<{ results: T[]; success: boolean }>;
      run(): Promise<{ success: boolean }>;
    };
  };
}

// Global variable giả lập trong bộ nhớ RAM để chạy cục bộ (local dev)
// Tránh dùng các thư viện Node.js (fs, path) để không gây lỗi biên dịch ở Edge runtime
const globalStorage = (globalThis as any);
if (!globalStorage.__mockD1Data) {
  globalStorage.__mockD1Data = {};
}

class LocalMockD1Database implements D1DatabaseSimple {
  private getStorage(): Record<string, any> {
    return globalStorage.__mockD1Data;
  }

  private saveStorage(data: Record<string, any>) {
    globalStorage.__mockD1Data = data;
    // Nếu ở browser, đồng bộ thêm vào localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("adsb-training-simulator:mock-d1", JSON.stringify(data));
      } catch (e) {
        // Bỏ qua lỗi hạn ngạch lưu trữ
      }
    }
  }

  prepare(query: string) {
    const isSelect = query.trim().toUpperCase().startsWith("SELECT");
    const isInsert = query.trim().toUpperCase().startsWith("INSERT");
    const isDelete = query.trim().toUpperCase().startsWith("DELETE");

    return {
      bind: (...args: any[]) => {
        return {
          first: async <T = any>(): Promise<T | null> => {
            const data = this.getStorage();
            const scenarios = Object.values(data.Scenarios || {}) as T[];
            if (scenarios.length === 0) return null;
            
            // Tìm theo ID (giả định tham số bind đầu tiên là ID)
            const id = args[0];
            const found = scenarios.find((s: any) => s.id === id);
            return found || null;
          },
          all: async <T = any>(): Promise<{ results: T[]; success: boolean }> => {
            const data = this.getStorage();
            const list = Object.values(data.Scenarios || {}) as T[];
            return { results: list, success: true };
          },
          run: async (): Promise<{ success: boolean }> => {
            const data = this.getStorage();
            if (!data.Scenarios) data.Scenarios = {};

            if (isInsert || query.includes("INSERT")) {
              // Gán trường theo thứ tự bind của schema.sql:
              // id, title, description, difficulty, sites_json, target_sensor_id, target_login_user, expected_actions_json, created_at, updated_at
              const [
                id,
                title,
                description,
                difficulty,
                sites_json,
                target_sensor_id,
                target_login_user,
                expected_actions_json,
                created_at,
                updated_at,
              ] = args;

              data.Scenarios[id] = {
                id,
                title,
                description,
                difficulty,
                sites_json,
                target_sensor_id,
                target_login_user,
                expected_actions_json,
                created_at,
                updated_at,
              };
              this.saveStorage(data);
            } else if (isDelete || query.includes("DELETE")) {
              const id = args[0];
              if (data.Scenarios[id]) {
                delete data.Scenarios[id];
                this.saveStorage(data);
              }
            }
            return { success: true };
          },
        };
      },
    };
  }
}

// Xuất hàm kết nối database
export function getDb(): D1DatabaseSimple {
  // Cloudflare Pages bindings được đưa vào process.env.DB
  const cloudflareDb = (process.env as any).DB;
  if (cloudflareDb) {
    return cloudflareDb as D1DatabaseSimple;
  }
  
  // Trả về mock database chạy trên RAM khi ở local dev
  return new LocalMockD1Database();
}

// Helper để parse dữ liệu SQL D1 sang định dạng Scenario TypeScript
export function mapRowToScenario(row: any): Scenario {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty as any,
    targetSensorId: row.target_sensor_id,
    targetLoginUser: row.target_login_user as any,
    sites: JSON.parse(row.sites_json) as SiteState[],
    expectedActions: JSON.parse(row.expected_actions_json) as RecordedAction[],
    createdAt: row.created_at,
    updatedAt: row.updated_at || undefined,
  };
}
