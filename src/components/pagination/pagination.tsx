import "./style.css";

// 페이징에 필요한 프로퍼티 인터페이스 선언
interface Props {
    total: number
    limit: number
    page: number
    setPage: any
}

export default function Pagination({ total, limit, page, setPage } : Props) {

    const numPages = Math.ceil(total / limit) === 0 ? 1 : Math.ceil(total / limit); // (전체 리스트 갯수 / 한 페이지당 리스트 갯수) : 페이지 넘버
    
    return (
        <>
            <nav id="navi">
                <button className="naviButton" onClick={() => setPage(page - 1)} disabled={page === 1}>&lt;</button>
                {
                    Array(numPages)
                        .fill(0)    // value 값 뭘 넣어야할지 몰라서 임시로 0 넣음. 아무숫자 넣어도 문제 없었음.
                        .map((_, i) => (    // 필요한건 i뿐. _는 뭔지 모름.
                            <button className="naviButton" key={i + 1} onClick={() => setPage(i + 1)} aria-current={page === i + 1 ? "page" : undefined}>{i + 1}</button>
                        ))
                }
                <button className="naviButton" onClick={() => setPage(page + 1)} disabled={page === numPages}>&gt;</button>
            </nav>
        </>
    );
}