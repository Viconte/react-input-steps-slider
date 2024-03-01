export function pluralize(value, words = []){
	if (words.length !== 3) return '';

	const twoLastNumber = Math.abs(value) % 100; 
	const num = twoLastNumber % 10;
	if(twoLastNumber > 10 && twoLastNumber < 20) return words[2]; 
	if(num > 1 && num < 5) return words[1];
	if(num === 1) return words[0]; 
	return words[2];
}