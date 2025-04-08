/**
 * Tips card component
 * Displays helpful tips for users about their profile
 */
const TipsCard = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-xl">Tips</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Change your avatar anytime from your profile page</li>
          <li>Your profile is visible to your contacts</li>
          <li>Keep your information secure</li>
        </ul>
      </div>
    </div>
  );
};

export default TipsCard;
