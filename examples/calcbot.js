const nodeogram = require('nodeogram'),
bot = new nodeogram.Bot('TOKEN');

bot.init();

bot.command('start', 'Start', false, (args, message) => {
    message.reply("Hi, i am simple calculator bot. send me /help to view a list of commands!");
});

bot.command('random', 'Generates a random number. Usage /random', false, (args, message) => {
    message.reply(Math.floor((Math.random() * 100) + 1));
});

bot.command('log', 'Returns the base 10 logarithm of a number. Usage /log [num]', false, (args, message) => {
    message.reply(Math.log10(args[0]));
});

bot.command('root', 'Return the square root of a number. Usage /root [num]', false, (args, message) => {
    message.reply(Math.sqrt(args[0]));
});

bot.command('tan', 'Returns the tangent of an angle. Usage /tan [num]', false, (args, message) => {
    message.reply(Math.tan(args[0]/180*Math.PI));
});

bot.command('sin', 'Returns the sine of an angle. Usage /sin [num]', false, (args, message) => {
    message.reply(Math.sin(args[0]/180*Math.PI)); 
});

bot.command('cos', 'Returns the cosine of an angle. Usage /cos [num]', false, (args, message) => {
    message.reply(Math.cos(args[0]/180*Math.PI));
});

bot.command('round', 'Rounds the number to the nearest integer. Usage /round [num]', false,  (args, message) => {
    message.reply(Math.round(args[0]));
});

bot.command('power', 'Returns the power of a number to the other. Usage /power [num1] [num2]', false, (args, message) => {
    message.reply(Math.pow(args[0], args[1]));
});

bot.command('antilog', 'Returns a number to the power of ten. Usage /antilog [num]', false, (args, message) => {
    message.reply(Math.pow(10, args[0]));
});

bot.command('add', 'Simple addition. Usage /add [num1] [num2]', false, (args, message) => {
    message.reply(parseFloat(args[0]) + parseFloat(args[1]));
});

bot.command('subtract', 'Simple subtraction. Usage /subtract [num1] [num2]', false, (args, message) => {
    message.reply(parseFloat(args[0]) - parseFloat(args[1]));
});

bot.command('multiply', 'Simple multiplication. usage /multiply [num1] [num2]', false, (args, message) => {
    message.reply(parseFloat(args[0]) * parseFloat(args[1]));
});

bot.command('divide', 'Simple division. Usage /divide [num1] [num2]', false,  (args, message) => {
    message.reply(parseFloat(args[0]) / parseFloat(args[1]));
});

bot.command('square', 'Returns the square of the number. Usage /square [num]', false, (args, message) => {
    message.reply(parseInt(args[0]) * parseInt(args[0]));
});

bot.command('pi', 'Returns the value of Pi. Usage /pi', false, (args, message) => {
    message.reply(Math.PI);
});

