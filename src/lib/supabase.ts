
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yqerheqqgozufhcwtrmo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxZXJoZXFxZ296dWZoY3d0cm1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1Njk2MjEsImV4cCI6MjA1NjE0NTYyMX0.DOXVhkRVAXrbCdY3H5cMZorzTXI7A0onHPqoDlST_MQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
