/* A Lightning Fast Multi-Purpose Calculator Bot.

Dev: Mohammed Sohail
Version: 1.1.0

*/

const nodeogram = require('nodeogram'),
bot = new nodeogram.Bot('token');
const math = require('mathjs');
const Keyboard = nodeogram.Keyboard;

var math2 = math.create({
  matrix: 'Array'       
});

bot.init();

var keyboard = new Keyboard();
keyboard.addButton(0, 0, {text: "Pi", callback_data: "π = 3.141592653589793 "});
keyboard.addButton(0, 1, {text: "Imaginary Unit", callback_data: "i = √–1 "});
keyboard.addButton(1, 0, {text: "Euler's Number", callback_data: "e = 2.718281828459045 "});
keyboard.addButton(1, 1, {text: "Golden Ratio", callback_data: "phi = 2.718281828459045 "});
keyboard.addButton(2, 0, {text: "Pythagoras' constant", callback_data: "√2 = 1.414213562373095 "});
keyboard.addButton(2, 1, {text: "Theodorus' constant", callback_data: "√3 = 1.732050807568877 "});
keyboard.addButton(3, 0, {text: "Omega Constant", callback_data: "Ω = 0.567143290409783 "});
keyboard.addButton(3, 1, {text: "Gravity Constant", callback_data: "G = 9.80665 (m/s)2 "});
keyboard.toInline();

bot.command('start', 'Displays "usage" For the first time', true, (args, message) => {
    message.reply("*Welcome To PowerCalcBot*\n\n/help\n/examples\n\n⚒`Made By` @kamikazechaser", {parse_mode: 'Markdown'})
});

bot.command('examples', 'Examples of commands', false, (args, message) => {
    message.reply("`/evaluate 2 + 3 +7 - 3 = 9`\n`/evaluate 3 * 8 / 6.58 +0.32 - 2.01 = 1.9574`\n`/evaluate cos(45 deg) * sqrt(625) = 13.1330`\n`/permutate 5 = 120`\n`/nthroot 9 2 = 3, as 3^2 == 9`\n`/exp 2 = 7.3891`\n`/range 1 11 = An Matrix of The Range`", {parse_mode: 'Markdown'})
});

bot.command('root', 'Returns the square root of a number. Usage /root [num]', false, (args, message) => {
    message.reply(math.sqrt(args[0]));
});

bot.command('range', 'Returns the range between two integers in Matrix form. Usage /range [num1] [num2]', false, (args, message) => {
    message.reply(math2.range(args[0], args[1]));
});

bot.command('random', 'Generates a random number. Usage /random', false, (args, message) => {
    message.reply(Math.floor((Math.random() * 100) + 1));
});

bot.command('log', 'Returns the base 10 logarithm of a number. Usage /log [num]', false, (args, message) => {
    message.reply(Math.log10(args[0]));
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

bot.command('permutate', 'Returns total number of objects in a permutation. Usage /permutate [num]', false,  (args, message) => {
    message.reply('permutations:' + ' ' + math.permutations(args[0]));
});

bot.command('power', 'Returns the power of a number to the other. Usage /power [num1] [num2]', false, (args, message) => {
    message.reply(Math.pow(args[0], args[1]));
});

bot.command('nthroot', 'Returns the nth root solution. Usage /nthroot [value] [its root]', false, (args, message) => {
    message.reply(math.nthRoot(args[0], args[1]));
});

bot.command('antilog', 'Returns a number to the power of ten. Usage /antilog [num]', false, (args, message) => {
    message.reply(Math.pow(10, args[0]));
});

bot.command('evaluate', 'Evaluates an expression, look at the /examples command for more information. Usage /evalaute ..', false, (args, message) => {
    message.reply(math.eval(args.join(" ")));
});

bot.command('lcm', 'Returns the Least Coomon Multiple of two numbers. Usage /lcm [num1] [num2]', false, (args, message) => {
    message.reply(math.lcm(args[0], args[1]));
});

bot.command('gcd', 'Returns the Highest Common Factor of two numbers. usage /gcd [num1] [num2]', false, (args, message) => {
    message.reply(math.gcd(args[0], args[1]));
});

bot.command('cube', 'Returns the cube of the number. Usage /square [num]', false, (args, message) => {
    message.reply(math.cube(args[0]));
});

bot.command('cbrt', 'Returns the cuberoot of the number. Usage /square [num]', false, (args, message) => {
    message.reply(math.cbrt(args[0]));
});

bot.command('square', 'Returns the square of the number. Usage /square [num]', false, (args, message) => {
    message.reply(math.square(args[0]));
});

bot.command('exp', 'Returns the exponent to the base of "e". Usage /square [num]', false, (args, message) => {
    message.reply(math.exp(args[0]));
});

bot.command('constants', 'Mathematical Constants', false, (args, message) => {
    message.reply("Mathematical Constants", {reply_markup: keyboard});
});

bot.on('callback_query', (query) => {
    query.answer('✅', true);
    if (query.message) query.message.editText(`${query.data}!`)
});