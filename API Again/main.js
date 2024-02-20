const API_KEY = `67aa192c984c45eb95665d2e6bc56b66`;
let newsList =[];
const menus = document.querySelectorAll(".menus button")
menus.forEach(menu=>
    menu.addEventListener("click",(event)=> getNewsByCategory(event)))
let url = new URL(
    `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`
);
let totalResults = 0
let page =1
const pageSize =10
const groupSize=5

const getNews =async () =>{
    try{
        const response = await fetch(url);
        const data = await response.json();
        if(response.status===200){
                if(data.articles.length===0){
                    throw new Error("No result for this search")
                }
            newsList=data.articles;
            render();
        }else{
            throw new Error(data.message)
        }
        newsList = data.articles;
        totalResult = data.totalResults
        render();
        paginationRender();
    }catch(error){
        console.log("error", error.message)
        errorRender(error.message)
    }


}

const getLastestNews = async () => {
    url = new URL(
        `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines`
    );
    getNews()
}

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    console.log(category)
    url = new URL(
        `http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?category=${category}&apiKey=${API_KEY}`
    );
    getNews()
};

const getNewsByKeyword=async() => {
    const keyword = document.getElementById("search-input").value;
    console.log(keyword)
    url = new URL(`http://times-node-env.eba-appvq3ef.ap-northeast-2.elasticbeanstalk.com/top-headlines?q=${keyword}&apiKey=${API_KEY}`)
    getNews()   
};

const render=()=>{
    const newsHTML = newsList.map(news=>`
    <div class = "row news">
    <div class = "col-lg-4">
        <img class="news-img-size" src=${news.urlToImage}/>
    </div>
    <div class="col-lg-8">
        <h2> ${news.title} </h2>
        <p>
            ${news.desciption}
        </p>
        <div>
            ${news.source.name}*${news.publishedAt}
        </div>
    </div>
</div>`
).join(' ');

    newsList

    document.getElementById("news-board").innerHTML=newsHTML
}

const errorRender =(errorMessage)=>{
    const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`

    document.getElementById("news-board").innerHTML=errorHTML;
}

const paginationRender=()=> {
    const pageGroup = Math.ceil(page/groupSize);
    const lastPage= pageGroup*groupSize
    const firstPage= lastPage-(groupSize-1)

    let paginationHTML=``

    for(let i=firstPage;i<=lastPage;i++){
        paginationHTML+=`<li class="page-item"><a class="page-link" href="#">${i}</a></li>`
    }

    document.querySelector(".pagination").innerHTML=paginationHTML
    // <nav aria-label="Page navigation example">
    // <ul class="pagination">
    //     <li class="page-item"><a class="page-link" href="#">Previous</a></li>
    //     <li class="page-item"><a class="page-link" href="#">1</a></li>
    //     <li class="page-item"><a class="page-link" href="#">2</a></li>
    //     <li class="page-item"><a class="page-link" href="#">3</a></li>
    //     <li class="page-item"><a class="page-link" href="#">Next</a></li>
    // </ul>
    // </nav>
}
getLastestNews();