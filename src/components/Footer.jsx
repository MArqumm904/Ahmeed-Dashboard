function Footer() {
    return (
      <footer className="bg-white shadow-inner py-4 px-6 mt-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-2 sm:mb-0">© 2025 My Dashboard. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;