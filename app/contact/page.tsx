import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const metadata = {
  title: "צור קשר | Vibe Code GLM",
  description: "צור קשר עם צוות Vibe Code GLM",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">צור קשר</h1>

      <div className="space-y-8">
        <section>
          <p className="text-lg text-gray-600 mb-6">יש לך שאלה, הצעה או משוב? נשמח לשמוע ממך!</p>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                שם מלא
              </label>
              <Input id="name" type="text" required />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                דואר אלקטרוני
              </label>
              <Input id="email" type="email" required />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                נושא
              </label>
              <Input id="subject" type="text" required />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                הודעה
              </label>
              <Textarea id="message" rows={6} required />
            </div>

            <Button type="submit" size="lg" className="w-full">
              שלח הודעה
            </Button>
          </form>
        </section>

        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">דרכי התקשרות נוספות</h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <strong>אימייל כללי:</strong> info@vibecodeglm.com
            </p>
            <p>
              <strong>תמיכה טכנית:</strong> support@vibecodeglm.com
            </p>
            <p>
              <strong>נגישות:</strong> accessibility@vibecodeglm.com
            </p>
            <p>
              <strong>פרטיות:</strong> privacy@vibecodeglm.com
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
