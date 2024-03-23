function SongSkeleton() {
  return (
    <div class="my-2 w-full rounded-md border border-gray-500 p-4 shadow">
      <div class="flex animate-pulse space-x-4">
        <div class="flex-1 space-y-6 py-1">
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-4">
              <div class="col-span-1 h-2 rounded bg-gray-500"></div>
            </div>
            <div class="grid grid-cols-9 gap-4">
              <div class="col-span-8 h-2 rounded bg-gray-500"></div>
              <div class="col-span-1 h-2 w-2 rounded-full bg-gray-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlaylistSkeleton() {
  return (
    <>
      <SongSkeleton />
      <SongSkeleton />
      <SongSkeleton />
      <SongSkeleton />
      <SongSkeleton />
      <SongSkeleton />
      <SongSkeleton />
      <SongSkeleton />
      <SongSkeleton />
      <SongSkeleton />
    </>
  );
}
