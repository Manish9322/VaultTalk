
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useAuth } from "@/hooks/use-auth"
import type { User } from "@/lib/data"

export function RecentRegistrations() {
  
  const { users } = useAuth();

  const recentUsers = users
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 4);

  const getAvatarUrl = (user: User) => {
    if (user.avatarType === 'custom' && user.avatar) {
      return user.avatar;
    }
    return PlaceHolderImages.find(img => img.id === user.avatar)?.imageUrl;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
        <CardDescription>
          Newest users who signed up.
        </CardDescription>
      </CardHeader>
      <CardContent>
         {recentUsers.length > 0 ? (
           <div className="space-y-4">
            {recentUsers.map(user => (
              <div className="flex items-center gap-4" key={user.id}>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={getAvatarUrl(user)} alt="Avatar" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
         ) : (
          <p className="text-sm text-muted-foreground text-center pt-4">No recent registrations.</p>
         )}
      </CardContent>
    </Card>
  )
}
