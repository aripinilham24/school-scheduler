import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home";
import Class from "./pages/Class";
import Teacher from "./pages/Teacher";
import Schedule from "./pages/Schedule";

// Untuk App yang belum selesai dapat menampilkan halaman sementara
function ComingSoon({ page }) {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-3 text-[#9ca3af]">
			<div className="w-16 h-16 rounded-2xl bg-[rgba(108,99,255,0.08)] flex items-center justify-center">
				<svg width="32" height="32" viewBox="0 0 32 32" fill="none">
					<rect
						x="4"
						y="4"
						width="24"
						height="4"
						rx="2"
						fill="#6C63FF"
						opacity="0.3"
					/>
					<rect
						x="4"
						y="13"
						width="16"
						height="4"
						rx="2"
						fill="#6C63FF"
						opacity="0.5"
					/>
					<rect
						x="4"
						y="22"
						width="20"
						height="4"
						rx="2"
						fill="#6C63FF"
						opacity="0.7"
					/>
				</svg>
			</div>
			<p className="text-sm font-semibold text-[#08060d]">Halaman {page}</p>
			<p className="text-xs text-[#c4c0ff]">Sedang dalam pengembangan...</p>
		</div>
	);
}

// Route config
const ROUTES = [
	{ path: "/", element: <Navigate to="/home" replace /> },
	{ path: "/home", element: <Home page="Home" />, active: "Home" },
	{
		path: "/class",
		element: <Class page="Class" />,
		active: "Class",
	},
	{
		path: "/teachers",
		element: <Teacher page="Teachers" />,
		active: "Teachers",
	},
	{
		path: "/mapel",
		element: <ComingSoon page="Mata Pelajaran" />,
		active: "Mata Pelajaran",
	},
	{
		path: "/generate",
		element: <Schedule page="Generate Jadwal" />,
		active: "Generate Jadwal",
	},
	{
		path: "/payments",
		element: <ComingSoon page="Payments" />,
		active: "Payments",
	},
	{
		path: "/library",
		element: <ComingSoon page="Library" />,
		active: "Library",
	},
	{
		path: "/reports",
		element: <ComingSoon page="Reports" />,
		active: "Reports",
	},
];

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				{ROUTES.map(({ path, element, active }) => (
					<Route
						key={path}
						path={path}
						element={
							active ? <Layout activeItem={active}>{element}</Layout> : element
						}
					/>
				))}

				{/* 404 fallback */}
				<Route
					path="*"
					element={
						<Layout activeItem="Home">
							<div className="flex flex-col items-center justify-center h-full gap-3 text-[#9ca3af]">
								<p className="text-6xl font-bold text-[#E5E7EB]">404</p>
								<p className="text-sm font-medium">Halaman tidak ditemukan</p>
							</div>
						</Layout>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
