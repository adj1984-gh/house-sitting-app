import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('API: Creating stay with data:', body)
    
    // First check if property exists
    const { data: propertyCheck, error: propertyError } = await supabaseAdmin
      .from('properties')
      .select('id')
      .eq('id', body.property_id)
      .single()
    
    if (propertyError) {
      console.error('Property does not exist:', propertyError)
      return NextResponse.json({ error: 'Property does not exist' }, { status: 400 })
    }
    
    console.log('Property exists:', propertyCheck)
    
    const { data, error } = await supabaseAdmin
      .from('stays')
      .insert([body])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating stay:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('Stay created successfully:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    console.log('API: Updating stay:', id, updates)
    
    const { data, error } = await supabaseAdmin
      .from('stays')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating stay:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing stay ID' }, { status: 400 })
    }
    
    console.log('API: Deleting stay:', id)
    
    const { error } = await supabaseAdmin
      .from('stays')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting stay:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
