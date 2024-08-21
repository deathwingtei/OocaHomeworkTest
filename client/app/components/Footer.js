export default function Footer(){
    return(
        <footer className="fixedFooter">
            copyright@ {(new Date().getFullYear())}
        </footer>
    )
}