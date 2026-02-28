import { supabase } from "./supabase";

export const QuestionsAPI = {
  fetchBySubject: async (subject: string, topic?: string) => {
    // Ye hum baad me Questions table se fetch karne ke liye setup karenge
    let query = supabase.from('questions').select('*').eq('subject', subject);
    if (topic) query = query.eq('topic', topic);
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  submitQuiz: async (results: any) => {
    // Ye results table me insert karne ke liye
    const { data, error } = await supabase.from('quiz_results').insert([results]).select();
    if (error) throw error;
    return data;
  }
};

export const AuthAPI = {
  login: async (credentials: { identifier: string; password?: string }) => {
    // Supabase default me Email se login karta hai
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.identifier,
      password: credentials.password!,
    });
    if (error) throw error;
    return { token: data.session?.access_token, user: data.user };
  },
  
  signup: async (userData: {
    name: string;
    username: string;
    phone: string;
    email: string;
    password?: string;
  }) => {
    // 1. Pehle Supabase Auth me user banayein (Email & Password se)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password!,
    });
    
    if (authError) throw authError;

    // 2. Fir bacha hua data (Name, Username, Phone) 'profiles' table me save karein
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id, // Ye ID Auth table se aayegi
          name: userData.name,
          username: userData.username,
          phone: userData.phone,
        }
      ]);
      if (profileError) console.error("Profile creation error:", profileError);
    }

    return { token: authData.session?.access_token, user: authData.user };
  },

  sendOtp: async (data: { identifier: string }) => {
    // Email par OTP bhejna
    const { error } = await supabase.auth.signInWithOtp({
      email: data.identifier,
    });
    if (error) throw error;
    return { success: true };
  },

  verifyOtp: async (data: { identifier: string; otp: string }) => {
    // Email par aaya OTP verify karna
    const { data: authData, error } = await supabase.auth.verifyOtp({
      email: data.identifier,
      token: data.otp,
      type: 'email',
    });
    if (error) throw error;
    return { token: authData.session?.access_token, user: authData.user };
  }
};