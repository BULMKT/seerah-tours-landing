import { supabase } from '@/lib/supabase';

export async function POST(request) {
  const { email } = await request.json();
  
  console.log('Email subscription request:', email);
  
  try {
    // Insert into Supabase email_subscribers table
    const { data, error } = await supabase
      .from('email_subscribers')
      .insert([
        {
          email: email,
          status: 'active',
          source: 'website_signup',
          subscribed_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase email subscription error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('Successfully subscribed email:', data);
    
    return Response.json({ 
      success: true, 
      message: 'Successfully subscribed! Redirecting to WhatsApp...',
      whatsappLink: 'https://chat.whatsapp.com/LxkH8gMkUlDBvJSYpl5FBm?mode=ac_t',
      subscriberId: data.id
    });
    
  } catch (error) {
    console.error('Email subscription error:', error);
    return Response.json(
      { success: false, message: error.message || 'Failed to subscribe' },
      { status: 500 }
    );
  }
}