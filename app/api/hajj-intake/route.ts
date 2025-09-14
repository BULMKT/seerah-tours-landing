import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Form submission data:', data);
    
    // Insert into Supabase using admin client (bypasses RLS)
    const { data: result, error } = await supabaseAdmin
      .from('form_submissions')
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        city_country: data.cityCountry,
        previous_experience: data.previousExperience,
        hajj_status: data.hajjStatus,
        travelling_with: data.travellingWith,
        traveller_count: data.travellerCount,
        departure_city: data.departurePreference,
        rooming_preference: data.roomingPreference,
        mobility_considerations: data.mobilityConsiderations,
        call_goals: data.callGoals,
        hear_about_us: data.hearAboutUs,
        hear_about_us_other: data.hearAboutUsOther,
        consent: data.consent,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insertion error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Successfully inserted form submission:', result);

    // Also submit to Airtable as backup (optional)
    const AIRTABLE_PAT = process.env.AIRTABLE_PAT;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Form Submissions';
    
    if (AIRTABLE_PAT && AIRTABLE_BASE_ID) {
      try {
        const airtableData = {
          fields: {
            'Full Name': data.fullName,
            'Email': data.email,
            'Phone': data.phone,
            'City & Country': data.cityCountry,
            'Previous Experience': data.previousExperience,
            'Hajj Status': data.hajjStatus,
            'Travelling With': data.travellingWith,
            'Traveller Count': data.travellerCount || null,
            'Departure Preference': data.departurePreference || '',
            'Rooming Preference': data.roomingPreference || '',
            'Mobility Considerations': data.mobilityConsiderations || '',
            'Call Goals': data.callGoals,
            'How Heard About Us': data.hearAboutUs || '',
            'How Heard About Us (Other)': data.hearAboutUsOther || '',
            'Consent': data.consent,
            'Status': 'New',
            'Submitted At': new Date().toISOString(),
          }
        };

        await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${AIRTABLE_PAT}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(airtableData),
          }
        );
      } catch (airtableError) {
        console.log('Airtable backup failed (non-critical):', airtableError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully',
      submissionId: result.id,
      data: {
        name: data.fullName,
        email: data.email,
      }
    });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit form' },
      { status: 500 }
    );
  }
}