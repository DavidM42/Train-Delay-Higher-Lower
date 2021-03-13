export default class Highscore {
    
    static get highscore() {
        const savedScore = Number.parseInt(localStorage.getItem('highscore'));
        return savedScore ? savedScore: 0;
    }

    static set highscore(highscore: number) {
        localStorage.setItem('highscore', highscore + '');
    }
}
