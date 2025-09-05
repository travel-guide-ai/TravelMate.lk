
export default function Footer() {
  return (
    <footer className="text-center py-6 bg-blue-50 text-gray-700 mt-12 text-base border-t border-blue-100" role="contentinfo">
      <p>&copy; {new Date().getFullYear()} <span className="text-blue-600 font-semibold">TravelMate.lk</span>. All rights reserved.</p>
    </footer>
  );
}
