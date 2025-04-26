const usePrefix = window.location.hostname === "localhost";

const url_prefix = usePrefix ? "https://cyberfox.app/in-dev/wild_kong/" : ""; // https://cyberfox.app/in-dev/wild_kong/

const ar_cyber_module = {
  init() {
    this.ARmodelURL_cyber = null;
    this.filename = null;
    this.loader = null;
    this.document_state = window.top.document || document;
    this.abortController = null;
    this.tries = 0;
    this.isChanged = false;

    return this;
  },

  set_isChanged(status) {
    this.isChanged = status;
  },

  create_loader() {
    this.document_state.body.insertAdjacentHTML(
      "beforeend",
      `
                <div class="preparing_ar" id="preparing_ar">
                <div class="div-block-21">
                    <p class="paragraph">AR prépare</p>
                    <div class="columns-23 w-row">
                    <span class="loader"></span>
                    </div>
                </div>
                </div>
                
                <style>
                .preparing_ar {
                    z-index: 9999;
                    grid-column-gap: 16px;
                    grid-row-gap: 16px;
                    background-color: #000;
                    grid-template-rows: auto auto;
                    grid-template-columns: 1fr 1fr;
                    grid-auto-columns: 1fr;
                    justify-content: center;
                    align-items: center;
                    display: none;
                    position: fixed;
                    top: 0%;
                    bottom: 0%;
                    left: 0%;
                    right: 0%;
                }
                
                .preparing_ar.show {
                    display: flex;
                }
                
                .preparing_ar .w-row {
                    display: flex;
                    justify-content: center;
                }
                
                .loader {
                    width: 48px;
                    height: 48px;
                    border: 5px solid #fff;
                    border-bottom-color: #ff3d00;
                    border-radius: 50%;
                    display: inline-block;
                    box-sizing: border-box;
                    animation: rotation 1s linear infinite;
                }
                
                @keyframes rotation {
                    0% {
                    transform: rotate(0deg);
                    }
                    100% {
                    transform: rotate(360deg);
                    }
                }
                </style>
            `
    );

    this.loader = this.document_state.querySelector("#preparing_ar");
  },
  get_loader() {
    return this.loader;
  },
  show_loader() {
    if (!this.get_loader()) this.create_loader();

    this.get_loader().classList.add("show");
  },
  hide_loader() {
    this.get_loader().classList.remove("show");
  },

  send_model_to_uploads(glbBase64) {
    if (this.abortController) this.abortController.abort();

    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    return new Promise(async (res, rej) => {
      const formData = new FormData();
      formData.append("file", glbBase64);
      if (this.filename) formData.append("filename", this.filename);

      fetch(url_prefix + "./upload.php", {
        method: "POST",
        signal,
        body: formData,
      })
        .then((response) => response.json())
        .then((response) => res(response))
        .catch((error) => rej(error));
    })
      .then(({ url, filename }) => {
        this.ARmodelURL_cyber = url;
        this.filename = filename;
        this.set_isChanged(false);

        return url;
      })
      .catch((err) => {
        this.tries += 1;
        console.error(err);
      })
      .finally(() => {
        this.abortController = null;
      });
  },

  async openAr({ onUploaded, get_glbBase64 }) {
    if (this.ARmodelURL_cyber && this.isChanged === false) {
      onUploaded(this.ARmodelURL_cyber);
    } else {
      if (this.tries > 20) return;

      this.show_loader();
      const glbBase64 = await get_glbBase64()();
      console.log({ glbBase64 });
      await this.send_model_to_uploads(glbBase64);
      console.log(this.ARmodelURL_cyber);
      this.openAr({ onUploaded, get_glbBase64 });
      this.hide_loader();
    }
  },
}.init();

window.ar_cyber_module = ar_cyber_module;
