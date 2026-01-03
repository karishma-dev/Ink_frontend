"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
	Save,
	Download,
	Menu,
	FileText,
	Users,
	FolderOpen,
	LogOut,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Editor, EditorStats, calculateStats } from "@/features/editor";
import { ChatSidebar } from "@/features/editor/components/ChatSidebar";
import { UploadModal } from "@/features/editor/components/UploadModal";
import { useAuth } from "@/features/auth";

export default function WritePage() {
	const [content, setContent] = useState("");
	const [title, setTitle] = useState("");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [showMenu, setShowMenu] = useState(false);
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const { logout } = useAuth();
	const stats = useMemo(() => calculateStats(content), [content]);

	const handleSave = async () => {
		setIsSaving(true);
		// TODO: Implement save to backend
		setTimeout(() => setIsSaving(false), 1000);
	};

	const handleExport = () => {
		const blob = new Blob([`# ${title}\n\n${content}`], {
			type: "text/markdown",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${title || "document"}.md`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className='h-screen flex flex-col bg-background'>
			{/* Top Header Bar */}
			<header className='h-12 bg-background border-b border-border flex items-center justify-between px-4 flex-shrink-0'>
				{/* Left - Logo & Menu */}
				<div className='flex items-center gap-3'>
					<Link href='/write' className='flex items-center gap-2'>
						<FileText className='h-5 w-5 text-primary' />
						<span className='font-semibold text-foreground'>AI Writer</span>
					</Link>

					{/* Navigation Menu */}
					<div className='relative'>
						<button
							onClick={() => setShowMenu(!showMenu)}
							className='p-1.5 rounded hover:bg-background-muted transition-colors'
						>
							<Menu className='h-4 w-4 text-foreground-muted' />
						</button>

						{showMenu && (
							<>
								<div
									className='fixed inset-0 z-40'
									onClick={() => setShowMenu(false)}
								/>
								<div className='absolute top-full left-0 mt-1 w-48 bg-background-elevated border border-border rounded-lg shadow-lg z-50 py-1'>
									<Link
										href='/drafts'
										className='flex items-center gap-2 px-3 py-2 text-sm hover:bg-background-muted transition-colors text-foreground'
										onClick={() => setShowMenu(false)}
									>
										<FolderOpen className='h-4 w-4' />
										Drafts
									</Link>
									<Link
										href='/documents'
										className='flex items-center gap-2 px-3 py-2 text-sm hover:bg-background-muted transition-colors text-foreground'
										onClick={() => setShowMenu(false)}
									>
										<FileText className='h-4 w-4' />
										Documents
									</Link>
									<Link
										href='/personas'
										className='flex items-center gap-2 px-3 py-2 text-sm hover:bg-background-muted transition-colors text-foreground'
										onClick={() => setShowMenu(false)}
									>
										<Users className='h-4 w-4' />
										Manage Personas
									</Link>
									<div className='border-t border-border my-1' />
									<button
										onClick={() => {
											logout();
											setShowMenu(false);
										}}
										className='flex items-center gap-2 px-3 py-2 text-sm hover:bg-background-muted transition-colors text-foreground w-full text-left'
									>
										<LogOut className='h-4 w-4' />
										Sign Out
									</button>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Right - Actions */}
				<div className='flex items-center gap-2'>
					<EditorStats {...stats} />
					<div className='w-px h-5 bg-border mx-2' />
					<Button variant='ghost' size='sm' onClick={handleExport}>
						<Download className='h-4 w-4' />
					</Button>
					<Button size='sm' onClick={handleSave} isLoading={isSaving}>
						<Save className='h-4 w-4' />
						<span className='hidden sm:inline ml-1'>Save</span>
					</Button>
				</div>
			</header>

			{/* Main Content Area */}
			<div className='flex-1 flex overflow-hidden'>
				{/* Editor Area */}
				<main className='flex-1 overflow-y-auto p-6'>
					<div className='max-w-3xl mx-auto'>
						{/* Title */}
						<input
							type='text'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='Untitled'
							className='w-full text-3xl font-bold text-foreground bg-transparent border-none outline-none placeholder:text-foreground-muted mb-4'
						/>

						{/* Editor Container with darker background */}
						<div className='editor-container p-6 min-h-[500px]'>
							<Editor
								value={content}
								onChange={setContent}
								placeholder='Start writing...'
							/>
						</div>
					</div>
				</main>

				{/* Right Chat Sidebar */}
				<ChatSidebar
					isOpen={isSidebarOpen}
					onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
					onUploadClick={() => setShowUploadModal(true)}
				/>
			</div>

			{/* Upload Modal */}
			<UploadModal
				isOpen={showUploadModal}
				onClose={() => setShowUploadModal(false)}
			/>
		</div>
	);
}
