"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FloppyDisk, DownloadSimple, ChatCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui";
import { Editor, EditorStats, calculateStats } from "@/features/editor";
import { ChatSidebar } from "@/features/editor/components/ChatSidebar";
import { UploadModal } from "@/features/editor/components/UploadModal";
import { DiffPreview } from "@/features/editor/components/DiffPreview";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
	setContent,
	setTitle,
	setSaving,
	setLastSaved,
} from "@/store/editorSlice";
import {
	updateDraftService,
	createDraftService,
} from "@/services/draftService";
import { useCollaboration } from "@/features/collaboration/hooks/useCollaboration";
import { useDraft } from "@/features/drafts/hooks/useDrafts";

export default function WritePage() {
	const searchParams = useSearchParams();
	const initialDraftId = searchParams.get("id");

	const dispatch = useAppDispatch();
	const { content, title, isSaving, lastSaved, presence } = useAppSelector(
		(state) => state.editor
	);

	const [isChatOpen, setIsChatOpen] = useState(false);
	const [showUploadModal, setShowUploadModal] = useState(false);
	const [draftId, setDraftId] = useState<number | null>(
		initialDraftId ? parseInt(initialDraftId) : null
	);

	const stats = useMemo(() => calculateStats(content), [content]);
	const { sendContent, sendCursor } = useCollaboration(draftId);

	// Load initial draft if ID is present
	const { data: draftData, isLoading: isLoadingDraft } = useDraft(draftId);

	useEffect(() => {
		if (draftData) {
			dispatch(setContent(draftData.content || ""));
			dispatch(setTitle(draftData.title || "Untitled"));
			dispatch(setLastSaved(draftData.updated_at));
		}
	}, [draftData, dispatch]);

	const handleSave = async () => {
		dispatch(setSaving(true));

		let res;
		if (draftId) {
			res = await updateDraftService(draftId, { title, content });
		} else {
			res = await createDraftService({ title, content });
			if (res.success && res.data) {
				setDraftId(res.data.id);
			}
		}

		if (res.success) {
			dispatch(setLastSaved(new Date().toISOString()));
		}

		dispatch(setSaving(false));
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

	if (isLoadingDraft) {
		return (
			<div className='h-full flex items-center justify-center bg-[#FEFEFA]'>
				<div className='flex flex-col items-center gap-4'>
					<div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin' />
					<p className='text-foreground-muted font-medium animate-pulse'>
						Opening your document...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='flex flex-col min-h-screen'>
			{/* Editor Header */}
			<header className='bg-background-surface flex items-center justify-between flex-shrink-0 border-b border-border px-6 py-3.5'>
				<div className='flex items-center gap-4'>
					<input
						type='text'
						value={title}
						onChange={(e) => dispatch(setTitle(e.target.value))}
						placeholder='Untitled'
						className='text-lg font-semibold text-foreground bg-transparent border-none outline-none placeholder:text-foreground-muted w-64'
					/>
					{lastSaved && (
						<span className='text-xs text-foreground-muted italic'>
							Saved at {new Date(lastSaved).toLocaleTimeString()}
						</span>
					)}
				</div>

				{/* Right Actions */}
				<div className='flex items-center gap-3'>
					{/* Presence Avatars */}
					<div className='flex -space-x-2 mr-2'>
						{presence.map((user) => (
							<div
								key={user.user_id}
								className='w-8 h-8 rounded-full border-2 border-background-surface flex items-center justify-center text-[10px] font-bold text-white shadow-md transition-transform hover:scale-110 cursor-default'
								style={{ backgroundColor: user.color }}
								title={user.username}
							>
								{user.username.slice(0, 2).toUpperCase()}
							</div>
						))}
					</div>

					<EditorStats {...stats} />
					<div className='w-px h-6 bg-border' />
					<Button
						variant='ghost'
						size='sm'
						onClick={handleExport}
						className='text-foreground-muted hover:text-foreground'
					>
						<DownloadSimple className='h-5 w-5' weight='duotone' />
					</Button>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => setIsChatOpen(!isChatOpen)}
						className={
							isChatOpen
								? "text-primary bg-primary-light"
								: "text-foreground-muted"
						}
					>
						<ChatCircle
							className='h-5 w-5'
							weight={isChatOpen ? "fill" : "duotone"}
						/>
					</Button>
					<Button
						size='sm'
						onClick={handleSave}
						isLoading={isSaving}
						disabled={isSaving}
					>
						<FloppyDisk className='h-4 w-4' weight='bold' />
						<span className='ml-1.5'>Save</span>
					</Button>
				</div>
			</header>

			{/* Main Content */}
			<div className='flex-1 flex overflow-hidden bg-[#FEFEFA]'>
				{/* Editor */}
				<main className='flex-1 overflow-y-auto'>
					<div className='max-w-3xl mx-auto py-12 px-8'>
						<Editor
							value={content}
							onChange={(val, pos) => {
								dispatch(setContent(val));
								sendContent(val, pos);
							}}
							onCursorChange={(pos) => sendCursor(pos)}
							placeholder='Start writing...'
						/>
					</div>
				</main>

				{/* AI Chat Sidebar */}
				{isChatOpen && (
					<aside className='w-96 flex-shrink-0'>
						<ChatSidebar
							isOpen={true}
							onToggle={() => setIsChatOpen(false)}
							onUploadClick={() => setShowUploadModal(true)}
							draftContent={content}
						/>
					</aside>
				)}
			</div>

			{/* AI Suggestions Preview */}
			<DiffPreview />

			{/* Upload Modal */}
			<UploadModal
				isOpen={showUploadModal}
				onClose={() => setShowUploadModal(false)}
			/>
		</div>
	);
}
