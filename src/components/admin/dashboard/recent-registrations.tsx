import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { users } from "@/lib/data"

export function RecentRegistrations() {
  
  const getAvatarUrl = (avatarId: string) => {
    return PlaceHolderImages.find(img => img.id === avatarId)?.imageUrl;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Registrations</CardTitle>
        <CardDescription>
          New users who signed up this month.
        </CardDescription>
      </CardHeader>
      <CardContent>
         <div className="space-y-4">
          {users.slice(0,4).map(user => (
            <div className="flex items-center gap-4" key={user.id}>
              <Avatar className="h-9 w-9">
                <AvatarImage src={getAvatarUrl(user.avatar)} alt="Avatar" />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
