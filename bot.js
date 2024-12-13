const { Telegraf } = require('telegraf');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN); // Load bot token
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY); // Connect to Supabase

bot.start(async (ctx) => {
  const referrerUsername = ctx.startPayload; // Extract referrer username from /start?username

  if (referrerUsername) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ referral_count: supabase.raw('referral_count + 1') })
        .eq('username', referrerUsername);

      if (error) {
        console.error('Error updating referral count:', error);
      } else {
        ctx.reply(`Welcome! Referrer ${referrerUsername} has been credited.`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      ctx.reply('An error occurred while processing your referral.');
    }
  } else {
    ctx.reply(`
        Welcome to the **BoldX Mining Bot**! 🚀
        
        You're now part of a cutting-edge mining community where you can **earn rewards** by participating in our mining activities. Here's what you can do:
        
        💎 **Start Mining**: Begin earning coins by simply activating your mining session.  
        🔗 **Referral Program**: Share your referral link with friends and earn additional rewards as they join the platform.  
        🎁 **Complete Tasks**: Check back dailyAlwasys complete tasks for free coins and rewards!  
        📊 **Track Your Progress**: View your earnings and mining statistics directly through the bot.
        
        We are preparing for our official launch in **March 2025**, so stay tuned for exciting updates and new features!
        
        Happy mining! ⛏️💰
        
        Your journey starts here:  
        **Earn 100 BLDX** for each friend you invite to the community!
        `);
        
  }
});

bot.launch(); // Start the bot
