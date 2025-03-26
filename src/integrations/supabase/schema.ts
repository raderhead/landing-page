
import { Database as OriginalDatabase } from './types';
import { Property } from '@/types/property';

// Extend the original Database type to include the properties table
export interface ExtendedDatabase extends OriginalDatabase {
  public: OriginalDatabase['public'] & {
    Tables: OriginalDatabase['public']['Tables'] & {
      properties: {
        Row: Property;
        Insert: Property;
        Update: Partial<Property>;
        Relationships: [];
      }
    }
  }
}

// Re-export this type to be used with supabase client
export type Database = ExtendedDatabase;
