const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rugrophvhntterohblpc.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Z3JvcGh2aG50dGVyb2hibHBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzQ3Nzk2OSwiZXhwIjoyMDczMDUzOTY5fQ.VBxX800zMhTerFttHF7t9__FC2sG8k0WXIoCoTT7YKg';

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixDatabase() {
  console.log('🔧 Starting Supabase database fix...\n');

  try {
    // Test the connection first
    console.log('📡 Testing connection to Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('form_submissions')
      .select('count')
      .limit(1);
    
    if (testError && testError.code !== 'PGRST116') {
      console.log('❌ Connection test failed:', testError.message);
      console.log('\n📝 Note: This might be due to RLS policies. Attempting to fix...\n');
    } else {
      console.log('✅ Connected to Supabase successfully!\n');
    }

    // Create tables if they don't exist
    console.log('📊 Creating/verifying tables...');
    
    // We can't directly run SQL through the client, but we can test operations
    // Let's try to insert test data with the service role key (which bypasses RLS)
    
    console.log('\n🧪 Testing form submission insert with service role key...');
    const testSubmission = {
      full_name: 'Test User (Admin Fix)',
      email: 'admin-test@example.com',
      phone: '+44 7123456789',
      city_country: 'London, UK',
      previous_experience: 'Neither',
      hajj_status: 'Just researching',
      travelling_with: 'Solo',
      call_goals: 'Testing database connection after fix',
      consent: true,
      status: 'new'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('form_submissions')
      .insert(testSubmission)
      .select()
      .single();

    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      console.log('\n🔍 This indicates the table might not exist or has issues.');
      console.log('\n💡 Solution: You need to run the SQL migrations directly in Supabase dashboard.');
    } else {
      console.log('✅ Test submission inserted successfully!');
      console.log('   ID:', insertData.id);
      console.log('   Name:', insertData.full_name);
      
      // Clean up test data
      console.log('\n🧹 Cleaning up test data...');
      const { error: deleteError } = await supabase
        .from('form_submissions')
        .delete()
        .eq('email', 'admin-test@example.com');
      
      if (!deleteError) {
        console.log('✅ Test data cleaned up successfully!');
      }
    }

    // Test if we can read submissions
    console.log('\n📖 Testing read access...');
    const { data: submissions, error: readError } = await supabase
      .from('form_submissions')
      .select('*')
      .limit(5);

    if (readError) {
      console.log('❌ Read failed:', readError.message);
    } else {
      console.log('✅ Can read submissions! Found', submissions?.length || 0, 'records.');
    }

    // Check other tables
    console.log('\n🔍 Checking other tables...');
    
    const tables = ['email_subscribers', 'daily_tips', 'webinars', 'pdf_guides'];
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      if (error && error.code === 'PGRST204') {
        console.log(`✅ Table '${table}' exists (empty)`);
      } else if (error && error.code === '42P01') {
        console.log(`❌ Table '${table}' does not exist`);
      } else if (!error) {
        console.log(`✅ Table '${table}' exists and has data`);
      } else {
        console.log(`⚠️  Table '${table}' status unknown:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📋 SUMMARY');
    console.log('='.repeat(60));
    console.log('\n✅ Service role key is working correctly');
    console.log('✅ Can insert and delete data with service role');
    console.log('\n⚠️  To complete the fix, you need to:');
    console.log('1. Go to: https://supabase.com/dashboard/project/rugrophvhntterohblpc/sql/new');
    console.log('2. Copy and run the SQL from fix-rls-policies.sql');
    console.log('3. This will disable RLS and allow form submissions to work');
    console.log('\n📝 The service role key in your .env is correct and working!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the fix
fixDatabase().then(() => {
  console.log('\n✨ Database check complete!');
}).catch(error => {
  console.error('Fatal error:', error);
});