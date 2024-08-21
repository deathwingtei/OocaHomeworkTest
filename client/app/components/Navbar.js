import CartPopup from './CartPopup';
export default function Navbar(){

    return(
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
             
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Ooca Shop</span>
                </a>
                <div className="  md:block md:w-auto" id="navbar-default">
                    <CartPopup />
                </div>
            </div>
        </nav>
    )
}
