const character = document.querySelector('.character');
let position = { x: 0, y: 0 };

function moveCharacter() {
    let randomNumber = Math.floor(Math.random() * 10) + 1;
    let direction = Math.floor(Math.random() * 4);

    for(let i = 0; i < randomNumber; i++) {
        switch(direction) {
            case 0:
                if(position.y > 0) {
                    position.y -= 30; // Yukarı
                }
                break;
            case 1:
                if(position.x < 270) {
                    position.x += 30; // Sağa
                }
                break;
            case 2:
                if(position.y < 270) {
                    position.y += 30; // Aşağı
                }
                break;
            case 3:
                if(position.x > 0) {
                    position.x -= 30; // Sola
                }
                break;
        }
        character.style.left = position.x + 'px';
        character.style.top = position.y + 'px';
    }
}
