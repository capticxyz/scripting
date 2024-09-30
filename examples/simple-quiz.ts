interface QuizQuestion {
    question: string
    options: string[]
    answer: string
    icon: string
}

export default class QuizElement extends CapElement {
    @property()
    currentQuestion = 0

    @property()
    score = 0

    @property()
    showResults = false

    // Quiz Data (replace with your own questions and answers)
    quizData: QuizQuestion[] = [
        {
            question: '1 What is the capital of France?',
            options: ['Berlin', 'Paris', 'Madrid', 'Rome'],
            answer: 'Paris',
            icon: 'location_city',
        },
        {
            question: '2 What is the highest mountain in the world?',
            options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'],
            answer: 'Mount Everest',
            icon: 'elevation',
        },
        {
            question: '3 What is the smallest country in the world?',
            options: ['Monaco', 'Vatican City', 'Nauru', 'Tuvalu'],
            answer: 'Vatican City',
            icon: 'flag',
        },
    ]

    render() {
        const question = this.quizData[this.currentQuestion]

        return html`
            ${this.showResults
                ? html`
                      <!-- Results Screen -->
                      <cap-uix-card-box
                          rotation="0 0 0"
                          width="3"
                          height="1"
                          depth="0.2"
                          position="0 3 -3.5"
                          curve-segments="32"
                      >
                          <cap-uix-text
                              id="questionText"
                              value="Quiz finished! Your score is ${this.score} out of ${this
                                  .quizData.length}"
                              align="center"
                              wrap-count="40"
                              position="0 0.25 0.25"
                              color="#000"
                              font-size="0.1"
                          ></cap-uix-text>
                          <cap-uix-button
                              position="0 -0.25 0.25"
                              @click="${() => this.startAgain()}"
                              width="1"
                              height="0.25"
                              color="#ac1838"
                          >
                              <cap-uix-text value="Start Again" font-size="0.1"></cap-uix-text>
                          </cap-uix-button>
                      </cap-uix-card-box>
                  `
                : html`
                      <!-- Question Box -->
                      <cap-uix-card-box
                          rotation="0 0 0"
                          width="3"
                          height="1"
                          depth="0.2"
                          position="0 3 -3.5"
                          curve-segments="32"
                      >
                          <cap-uix-text
                              id="questionText"
                              value="${question.question}"
                              align="center"
                              wrap-count="40"
                              position="0 0.25 0.25"
                              color="#000"
                              font-size="0.1"
                          ></cap-uix-text>
                      </cap-uix-card-box>

                      <!-- Answer Boxes -->
                      ${question.options.map(
                          (option, index) => html`
                              <cap-box-rounded
                                  id="answer${index + 1}"
                                  class="answer ui"
                                  position="${index % 2 === 0 ? '-1.1' : '1.1'} ${Math.floor(
                                      index / 2,
                                  ) *
                                      0.9 +
                                  0.6} -3"
                                  width="2"
                                  height="0.5"
                                  depth="0.1"
                                  color="lightblue"
                                  answer-data="${option}"
                                  @click="${() => this.checkAnswer(option)}"
                                  @mouseover=${(e) => {
                                      e.target.setAttribute('color', 'lightgray')
                                  }}
                                  @mouseout=${(e) => {
                                      e.target.setAttribute('color', 'lightblue')
                                  }}
                              >
                                  <cap-uix-icon
                                      position="-0.5 0 0.1"
                                      icon=${question.icon}
                                      size="0.2"
                                      color="#c43764"
                                  ></cap-uix-icon>
                                  <cap-uix-text
                                      id="answer${index + 1}Text"
                                      value="${option}"
                                      align="center"
                                      wrap-count="40"
                                      position="0 0 0.1"
                                      color="#fff"
                                      font-size="0.1"
                                  ></cap-uix-text>
                              </cap-box-rounded>
                          `,
                      )}
                  `}
        `
    }

    // Function to check the answer
    checkAnswer(selectedAnswer: string) {
        const question = this.quizData[this.currentQuestion]

        if (selectedAnswer === question.answer) {
            this.score++
        }

        this.currentQuestion++

        if (this.currentQuestion >= this.quizData.length) {
            this.showResults = true
        }
    }

    startAgain() {
        this.currentQuestion = 0
        this.score = 0
        this.showResults = false
    }
}
