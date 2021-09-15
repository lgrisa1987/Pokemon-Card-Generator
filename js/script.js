import './webfont.js'



class PokemonCardGenerator {
    DOMElements = {
        card: document.getElementById('card'),
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
                    await this.promiseResolve(200);
                    this.getPokemonData(e);
                });
            },
            imgLoad(img) {
                return new Promise(resolve => {
                    img.addEventListener('load', () => {
                        resolve();
                    });
                })

            },
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
                card
            } = this.DOMElements,
            appendTypes = (types) => {
                return types.map(type => `<span class="${color}">${type.type.name}</span>`).join("");
            };
        card.innerHTML = `
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
        const img = [...card.children].find(el => el.tagName === 'IMG'),
            event = e;
        await this.eventListeners().imgLoad(img);
        event && this.showCard();

    }
    showCard() {
        const {
            card
        } = this.DOMElements;
        if (card.classList.contains('hide')) card.classList.remove('hide');
        else {
            card.classList.add('hide')
        };
    }
}

const app = new PokemonCardGenerator();