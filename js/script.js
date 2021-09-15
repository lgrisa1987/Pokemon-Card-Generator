import './webfont.js'



class PokemonCardGenerator {
    DOMElements = {
        front: document.querySelector('.card__front'),
        btn: document.getElementById('btn')
    }
    constructor() {
        this.init();
    }
    init() {
        this.getPokemonData();
        this.eventListeners().btnClick();
        this.loadFonts();
    }
    eventListeners() {
        const {
            btn
        } = this.DOMElements;
        return {
            btnClick: () => {
                btn.addEventListener('click', async e => {
                    this.showCard();
                    await this.promiseResolve(500);
                    this.getPokemonData(e);
                });
            },
            handleEvent(element, event) {
                return new Promise(resolve => {
                    element.addEventListener(event, () => {
                        resolve();
                    });
                })
            }
        }
    }
    promiseResolve(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        })
    }
    loadFonts() {
        WebFont.load({
            google: {
                families: ['Poppins']
            },
            active: () => {
                console.log("Poppins ready");
                document.body.classList.add("show");
            }
        });
    }
    async getPokemonData(e) {
        try {
            const randomId = Math.ceil(Math.random() * 150),
                url = `https://pokeapi.co/api/v2/pokemon/${randomId}`,
                response = await fetch(url),
                data = await response.json();
            this.generateCard(data, e);
        } catch (error) {
            console.log(error)
        }
    }
    async generateCard(data, e) {
        const hp = data.stats[0].base_stat,
            imgSrc = data.sprites.other.dream_world.front_default,
            pokeName = data.name[0].toUpperCase() + data.name.slice(1),
            statAttack = data.stats[1].base_stat,
            statDefense = data.stats[2].base_stat,
            statSpeed = data.stats[5].base_stat,
            color = data.types[0].type.name,
            {
                front
            } = this.DOMElements,
            appendTypes = (types) => {
                return types.map(type => `<span class="${color}">${type.type.name}</span>`).join("");
            };
        front.innerHTML = `
                <p class="hp">
                    <span>HP</span>
                    ${hp}
                </p>
                <img src="${imgSrc}" alt="${pokeName}">
                <div class="circle ${color}"></div>
                <h2 class="poke-name">${pokeName}</h2>
                <div class="types">
                    ${appendTypes(data.types)}
                </div>
                <div class="stats ${color}">
                    <div>
                        <h3>${statAttack}</h3>
                        <p>Attack</p>
                    </div>
                    <div>
                        <h3>${statDefense}</h3>
                        <p>Defense</p>
                    </div>
                    <div>
                        <h3>${statSpeed}</h3>
                        <p>Speed</p>
                    </div>
                </div>
        `;
        const img = front.querySelector('img'),
            event = e;
        await this.eventListeners().handleEvent(img, 'load');
        event && this.showCard();

    }
    async showCard() {
        const {
            front
        } = this.DOMElements,
            cardInner = front.parentElement,
            cardContainer = cardInner.parentElement;
        if (cardInner.classList.contains('rotate')) {
            cardInner.classList.remove('rotate');
            await this.eventListeners().handleEvent(cardInner, 'transitionend');
            !cardInner.classList.contains('rotate') && cardContainer.removeAttribute('class');
        } else {
            cardContainer.classList.add('perspective');
            cardInner.classList.add('rotate');
        };
    }
}

const app = new PokemonCardGenerator();