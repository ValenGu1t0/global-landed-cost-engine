interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className='flex flex-col justify-center gap-0.5'>
      <h2 className='text-3xl leading-tight font-bold tracking-tight'>
        {title}
      </h2>
      <p className='text-muted-foreground text-sm leading-tight'>
        {description}
      </p>
    </div>
  );
};
