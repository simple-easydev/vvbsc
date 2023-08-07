const result = [
	{
		answers: [[1], [1], [2, 0, 1]],
		createdAt:1686826544,
		votor:"0xA97996Eaeab1987D3AFB0CF518e0B206F5798f90"
	},
	{
		answers: [[0], [1], [2, 0, 1]],
		createdAt:1686826544,
		votor:"0xA97996Eaeab1987D3AFB0CF518e0B206F5798f90"
	},
]
// question 1 : 
// yes : (1)
// No : (0)

// queston 2 :
// choice 1: (1)
// choice 2: (0)

// question3 
// rank1: (5)
// rank1: (4)
// rank1: (3)


// Yes or no Question #1

const questions = [
	{text: "Yes or no Question #1", type: 0, choices: ["Yes", "No"]},
	{text: "Multiple choice question", type: 1, choices: ["Choice1", "Choice2"]},
	{text: "rank choice question", type: 2, choices: ["rank1", "rank2", "rank3"]}
]


const getPoints = (qIndex, aIndex, qType) => {
	
	return result.reduce((acc, curObj, index)=>{
		const ansR = curObj.answers[qIndex]
		const pos = ansR.indexOf(aIndex)
		if(pos>-1){
			if(qType == 2){
				return acc + (5 - pos)
			}
			return acc + 1
		}
		return acc
	},0)
}


for(let index = 0; index<questions.length; index++){
	const data = []
	const question = questions[index]
	for (let i = 0; i < question.choices.length; i++) {
		data.push({
			text: question.choices[i],
			weight: getPoints(index, i, question.type),
		})
	}
	console.log(data)
}
