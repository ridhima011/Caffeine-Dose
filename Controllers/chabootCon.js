const getBotResponse = async (message) => {
  console.log("User message:", message);

  let botResponse = "Sorry, I didn't understand that.";

  // Normalize message by converting to lowercase
  message = message.toLowerCase();

  // Basic response logic
  if (message.includes("menu")) {
    botResponse = "Our menu includes Espresso, Latte, Cappuccino, and Mocha. What would you like to order?";
  } else if (message.includes("order")) {
    botResponse = "Please choose your coffee and I'll guide you through the order process!";
    
  } else if (message.includes("help")) {
    botResponse = "I can help you with our menu or assist you with placing an order. Just let me know!";
  } else if (message.includes("hours")) {
    botResponse = "We are open from 7 AM to 9 PM every day. Feel free to drop by!";
  } else if (message.includes("location") || message.includes("address")) {
    botResponse = "We are located at 123 Coffee St, Cityville. Visit us anytime!";
  } else if (message.includes("price") || message.includes("cost")) {
    botResponse = "Our prices range from $3 to $7 depending on the drink. You can view the full menu for details.";
  } else if (message.includes("thank you") || message.includes("thanks")) {
    botResponse = "You're welcome! Let me know if you need anything else.";
  } else if (message.includes("hello")) {
    botResponse = "Hello Sudeep sir please give this team good grade!";
  }
  console.log("Bot response:", botResponse);
  return botResponse;
};

module.exports = {
  getBotResponse,
}


  