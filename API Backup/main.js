const API_KEY = `67aa192c984c45eb95665d2e6bc56b66`;
let newsList =[];
const menus = document.querySelectorAll(".menus button")
menus.forEach(menu=>
    menu.addEventListener("click",(event)=> getNewsByCategory(event)))
let url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
);
let totalResults = 0
let page =1
const pageSize =10
const groupSize=5

const getNews =async () =>{
    try{        
        url.searchParams.set("page",page)
        url.searchParams.set("pageSize",pageSize)

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
        totalResults = data.totalResults
        render();
        paginationRender();
    }catch(error){
        console.log("error", error.message)
        errorRender(error.message)
    }


}

const getLastestNews = async () => {
    url = new URL(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
    );
    getNews()
}

const getNewsByCategory = async (event) => {
    const category = event.target.textContent.toLowerCase();
    console.log(category)
    url = new URL(
        `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
    );
    getNews()
};

const getNewsByKeyword=async() => {
    const keyword = document.getElementById("search-input").value;
    console.log(keyword)
    url = new URL(`https://newsapi.org/v2/top-headlines?country=us&Q=${keyword}&apiKey=${API_KEY}`)
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
    const totalPages = Math.ceil(totalResults/pageSize);
    const pageGroup = Math.ceil(page/groupSize);

    let lastPage= pageGroup*groupSize;

    if(lastPage > totalPages){
        lastPage = totalPages
    };

    const firstPage =
        lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

    let paginationHTML=`  <li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" href="#">Previous</a></li>`

    for(let i=firstPage;i<=lastPage;i++){
        paginationHTML+=`<li class="page-item ${
            i === page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }

    paginationHTML +=`   <li class="page-item" onclick="moveToPage(${page+1})"><a class="page-link" href="#">Next</a></li>`
    document.querySelector(".pagination").innerHTML=paginationHTML;
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

const moveToPage=(pageNum)=>{
    console.log("moveTopage",pageNum);
    page=pageNum;
}
getLastestNews();


// 클릭한 페이지 불러오기
// 첫번째 마지막 페이지 조정
// 선택한 페이지에 파란불 들어오기

//next previous버튼으로 넘어가기 page +-1