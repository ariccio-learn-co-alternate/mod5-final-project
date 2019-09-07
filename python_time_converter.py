# little utility for converting youtube time to seconds.
# helps extract evans sound effects with ffmpeg

import datetime
import sys



def main():
    print(sys.argv)
    time = sys.argv[1]
    split_time = time.split(":")
    print(split_time)
    duration = datetime.timedelta(hours=int(split_time[0]), minutes=int(split_time[1]), seconds=int(split_time[2]))
    print("totalseconds: {}".format(duration.total_seconds()))


if __name__ == '__main__':
    main()