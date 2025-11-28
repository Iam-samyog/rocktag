import ProfileCard from "@/components/ProfileCard";

export default function CatProfileTest() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Cat Profile Test - Cached Implementation
      </h1>

      <div className="grid gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Default Cat (Mr. Kitten)
          </h2>
          <ProfileCard catId="default" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Cat ID: 1 (Microwave)</h2>
          <ProfileCard catId="1" />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Cat ID: 2 (Professor Whiskers)
          </h2>
          <ProfileCard catId="2" />
        </div>
      </div>
    </div>
  );
}
