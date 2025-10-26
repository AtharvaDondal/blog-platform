'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc/client';
import { Navbar } from '@/components/layout/Navbar';
import { formatDate } from '@/lib/utils';

export default function ManagePostsPage() {
    const utils = trpc.useUtils();

    const { data: posts, isLoading } = trpc.post.list.useQuery({});

    const deletePost = trpc.post.delete.useMutation({
        onSuccess: () => {
            toast.success('Post deleted successfully');
            utils.post.list.invalidate();
        },
        onError: (error) => {
            toast.error(`Error deleting post: ${error.message}`);
        },
    });

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            deletePost.mutate({ id });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Manage Posts</h1>
                        <p className="text-gray-600">Edit, delete, or create new posts</p>
                    </div>
                    <Button className='cursor-pointer' asChild>
                        <Link href="/dashboard/posts/new">
                            <Plus className="w-4 h-4 mr-2" />
                            New Post
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : posts && posts.length > 0 ? (
                    <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Categories</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium max-w-md truncate">
                                            {post.title}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={post.published ? 'default' : 'secondary'}>
                                                {post.published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {post.categories?.slice(0, 2).map((cat) => (
                                                    <Badge key={cat.id} variant="outline" className="text-xs">
                                                        {cat.name}
                                                    </Badge>
                                                ))}
                                                {post.categories && post.categories.length > 2 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{post.categories.length - 2}
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(post.createdAt)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button className='cursor-pointer' variant="ghost" size="sm">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/blog/${post.slug}`}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/posts/${post.id}/edit`}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDelete(post.id, post.title)}
                                                    >
                                                        <Trash className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 mb-4">No posts yet</p>
                        <Button className='cursor-pointer' asChild>
                            <Link href="/dashboard/posts/new">Create your first post</Link>
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}