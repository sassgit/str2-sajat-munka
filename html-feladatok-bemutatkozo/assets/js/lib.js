

export async function loadImages(gallery, indexurl, imgdirectory, divClassList, imgClassList) {
    try {
        let itext = await (await fetch(indexurl)).text();
        let iarray = itext.split("\n");
        iarray.forEach((line, i) => {
            let regex = new RegExp()
            let dir =  indexurl
            line = line.replace('\r', '');
            let data = line.split('\t');
            if (data.length == 2)
            {
                let div = document.createElement("div");
                let img = document.createElement("img");
                if (divClassList && divClassList.forEach)
                    divClassList.forEach( elem => div.classList.add(elem));
                if (imgClassList && imgClassList.forEach)
                    imgClassList.forEach( elem => img.classList.add(elem));
                img.setAttribute("src", imgdirectory + data[0]);
                img.setAttribute("alt", data[1]);
                div.appendChild(img);
                gallery.appendChild(div);
            }
        })

    } catch (error) {
        gallery.innerHTML = "Hiba!<br><br>Nem sikerült betölteni a képeket!<br><br>" + error;
    }

}

export function Timer (func, interval = 100, enabled = true, ...args) {
    this.func = func;
    this.interval = interval;
    this.enabled = enabled;
    this.kill = false;
    this.cycles = 0;
    this.args = args;
    (async () => {
        do {
            if (this.enabled)
                await new Promise((resolve, reject) => setTimeout(() => {
                    if (!this.kill) {
                        this.func.call(this, this.args);
                        this.cycles++;
                        resolve();
                    }
                }, this.interval));
            else
                await new Promise((resolve, reject) => setTimeout(() => resolve(), this.interval));
        } while (!this.kill);
    })();
};

