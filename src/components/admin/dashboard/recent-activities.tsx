
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useAuth } from "@/hooks/use-auth"
import type { User } from "@/lib/data"

export function RecentActivities() {
  const { users } = useAuth();

  const getAvatarUrl = (user: User) => {
    if (user.avatarType === 'custom') {
      return user.avatar;
    }
    return PlaceHolderImages.find(img => img.id === user.avatar)?.imageUrl;
  }
  
  // This component's data is mocked. In a real app, you'd fetch real feedback.
  const usersWithFeedback = users.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
        <CardDescription>A placeholder for recent user feedback.</CardDescription>
      </CardHeader>
      <CardContent>
         {usersWithFeedback.length > 0 ? (
            <div className="grid gap-6">
              {usersWithFeedback.map((user) => (
                <div key={user.id} className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={getAvatarUrl(user)} alt="Avatar" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="ml-auto font-medium">Message</div>
                </div>
              ))}
            </div>
         ) : (
            <p className="text-sm text-muted-foreground text-center pt-4">No recent feedback to display.</p>
         )}
      </CardContent>
    </Card>
  )
}
